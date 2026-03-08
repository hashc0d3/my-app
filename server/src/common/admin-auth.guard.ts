import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { env } from "../config/env";

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers["x-admin-token"] as string | undefined;
    if (!token || token !== env.adminToken) {
      throw new UnauthorizedException("Invalid admin token");
    }
    return true;
  }
}
