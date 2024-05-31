import { EventBase } from 'src/cores/event/event.base';
import { RegisterBusinessEventDto } from '../dto/register-business-event.dto';

export class RegisterBusinessEvent {
  constructor(public payload: RegisterBusinessEventDto) {}
}
