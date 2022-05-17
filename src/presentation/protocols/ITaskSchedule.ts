export interface ITaskSchedule {
  run(dateTime: string, task: any): Promise<void>
}