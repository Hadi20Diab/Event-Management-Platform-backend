import { Request, Response, NextFunction } from "express";

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Default response
    let status = 500;
    let payload: any = { message: "Internal Server Error" };

    // Mongoose validation error
    if (err && err.name === "ValidationError") {
        status = 400;
        payload = { message: "Validation failed", details: err.errors };
    }

    // Mongoose cast error (invalid ObjectId)
    else if (err && err.name === "CastError") {
        status = 400;
        payload = { message: `Invalid ${err.path}: ${err.value}` };
    }

    // Mongo duplicate key
    else if (err && err.code === 11000) {
        status = 409;
        const key = Object.keys(err.keyValue || {}).join(", ");
        payload = { message: "Duplicate key error", details: err.keyValue, key };
    }

    // Custom error with status
    else if (err && err.statusCode && err.message) {
        status = err.statusCode;
        payload = { message: err.message, details: err.details };
    }

    // For other errors expose message in non-production
    else if (err && err.message) {
        payload = { message: err.message };
    }

    // Log the error (server-side)
    console.error(err);

    res.status(status).json(payload);
};

export default errorHandler;
