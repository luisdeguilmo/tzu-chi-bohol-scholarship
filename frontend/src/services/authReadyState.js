// authReadyState.js — shared between AuthContext and axiosConfig
let authReady = false;
let waiters = [];

export function markAuthReady() {
    authReady = true;
    waiters.forEach((resolve) => resolve());
    waiters = [];
}

export function whenAuthReady() {
    if (authReady) return Promise.resolve();
    return new Promise((resolve) => waiters.push(resolve));
}