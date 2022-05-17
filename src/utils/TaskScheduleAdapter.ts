import { ITaskSchedule } from "../presentation/protocols/ITaskSchedule";
import { schedule } from 'node-cron'

export class TaskScheduleAdapter implements ITaskSchedule {

  async run(dateTime: string, task: any): Promise<void> {

    schedule(dateTime, () => {
      console.log(task);
    });
  }

}