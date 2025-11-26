export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidChannelName(name: string): boolean {
    return name.length >= 3 && name.length <= 20 && /^[a-z0-9-]+$/.test(name);
}

export function isValidMessage(content: string): boolean {
    return content.trim().length > 0 && content.length <= 2000;
}
