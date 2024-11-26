
interface GuestSessionCreate {
    success: boolean;
    expires_at: string;
    guest_session_id: string;
}

interface RequestTokenCreate {
    success: boolean;
    expires_at: string;
    request_token: string;
}

interface SessionCreate {
    success: boolean;
    session_id: string;
}

export type {
    GuestSessionCreate,
    RequestTokenCreate,
    SessionCreate
};