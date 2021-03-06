import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { TaskService } from '@milestone/task/service';
import { Task } from '@milestone/task/model';

export class UserTaskController {
	private readonly taskService: TaskService = new TaskService();

	/**
	 * Read tasks from user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readUserTasks(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;

			if (!userID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const tasks: Task[] = await this.taskService.readAll({
				order: {
					priority: 'DESC'
				},
				where: {
					assignee: { id: userID },
					completed: false
				}
			});

			return res.json({ status: res.statusCode, data: tasks });
		} catch (err) {
			return next(err);
		}
	}
}
