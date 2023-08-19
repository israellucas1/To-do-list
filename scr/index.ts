(() => {
    enum NotificationPlatform {
        SMS = 'SMS',
        EMAIL = 'EMAIL',
        PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
    }
    const UUID = (): string=>{
        return Math.random().toString(32).substr(2,9)
    }
    const DateUtils = {
        tomorrow(): Date{
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate()+1)
            return tomorrow
        },
        today(): Date {
            return new Date()
        },
        formatDate(date: Date): string{
            return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`
        }
    }
    interface Task {
        id: string
        dateCreated: Date
        dateUpdated: Date
        description: string
        render(): string
    }
    class Todo implements Task {
        id: string = UUID()
        dateCreated: Date = DateUtils.today()
        dateUpdated: Date = DateUtils.today()
        description: string = ""
        done: boolean = false

        render(): string {
            return `
            --->TODO<---
            description: ${this.description}
            done: ${this.done}
            `
        }
        constructor(description: string) {
            this.description = description
        }
    }
    class Reminder implements Task {
        id: string = UUID()
        dateCreated: Date = DateUtils.today()
        dateUpdated: Date = DateUtils.today()
        description: string = ""
        date: Date = DateUtils.tomorrow()
        notification: Array<NotificationPlatform> = [NotificationPlatform.EMAIL]

        render(): string {
            return `
            --->Reminder<---
            description: ${this.description}
            date: ${DateUtils.formatDate(this.date)}
            platform: ${this.notification.join(', ')}
            `
        }
        constructor(desciption: string, date: Date, notification: Array<NotificationPlatform>) {
            this.description = desciption
            this.date = date
            this.notification = notification
        }
    }
    const todo: Todo = new Todo("Todo criada")
    const reminder: Reminder = new Reminder("Reminder criado", new Date(), [NotificationPlatform.EMAIL])

    const taskView = {
        render(tasks: Array<Task>) {
            const tasksList = document.querySelector('#tasksList')
            while (tasksList?.firstChild) {
                tasksList.removeChild(tasksList.firstChild)
            }
            tasks.forEach((task) => {
                const li = document.createElement("li")
                const textNode = document.createTextNode(task.render())
                li.appendChild(textNode)
                tasksList.appendChild(li)
            })
        }
    }
    const TasksController = (view: typeof taskView)=>{
        const tasks: Array<Task> = [todo, reminder]

        const handleTaskCreate = (event: Event)=>{
            event.preventDefault()
            view.render(tasks)
        }
        document.querySelector('#taskForm')?.addEventListener('submit', handleTaskCreate)
    }

    TasksController(taskView)
})()