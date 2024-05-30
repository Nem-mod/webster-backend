import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CanvasService } from '../canvas.service';

@Injectable()
export class CanvasOwnerGuard implements CanActivate {
  constructor(private readonly canvasService: CanvasService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const canvasId = request.params.id;
    const userId = request.user._id;

    return this.canvasService.isCanvasOwner(canvasId, userId);
  }
}
