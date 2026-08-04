import {ShopSettingsType} from "@/types/ShopSettingsType";

export type UserRoleType = "admin" | "manager" | "salesman";

export type AuthUserType = {
    id: number;
    tenant_id: number;
    name: string;
    email: string;
    role: UserRoleType;
    is_active: boolean;
    pin_login: boolean;
    pin: string | null;
    has_pin: boolean;
}

export type LoginResultType = {
    token: string;
    role: UserRoleType;
    shop_settings: ShopSettingsType | null;
}

export type RegisterResultType = {
    token: string;
    role: UserRoleType;
}