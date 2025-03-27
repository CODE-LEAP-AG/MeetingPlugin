import {
  DocumentStatus,
  Permission,
  Task_Step_Status
} from "./Enum"

export interface Document {
    Id: number;
    DocumentName: string;
    Category: string;
    SharedWith: DocumentRoleId[];
    CreationDate: Date;
    LastEdited: Date;
    Status: DocumentStatus;
}

export interface Recording {
    id: number;
    recordingName: string;
    date: Date;
    transcripted: boolean;
    transcript: string;
}

export interface DocumentRoleId{
  UserId: number,
  Authorize: string[],
}

export interface Memo {
  id: number;
  createdDate: Date;
  description: string;
  participants: User[];
  tasks: Task[];
  documents: Document[];
  steps: Step[];
}

export interface Step {
    stepNumber: number;
    stepDescription: string;
    tasks: number[];
    status: Task_Step_Status;
}

export interface Task {
    id: number;
    name: string;
    type: string;
    inputType: string;
    value: string | number | boolean;
    assignee: string;
    status: Task_Step_Status;
    document: string;
}

export interface User {
  id: number;
  name: string;
  shortName: string;
  role: string;
  permission: Permission[];
  backgroundColor: string;
}


