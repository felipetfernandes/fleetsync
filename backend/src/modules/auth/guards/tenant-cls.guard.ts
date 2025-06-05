import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class TenantClsGuard implements CanActivate {
  constructor(private readonly cls: ClsService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (user && user.companyId) {
      this.cls.set('TENANT_USER_ROLE', user.role);
      this.cls.set('TENANT_COMPANY_ID', user.companyId);

      if (user.branchId) {
        this.cls.set('TENANT_BRANCH_ID', user.branchId);
      }
      if (user.workshopId) {
        this.cls.set('TENANT_WORKSHOP_ID', user.workshopId);
      }

    } else {
      console.warn('User or companyId not found on request in Guard.');
    }

    return true;
  }
}
