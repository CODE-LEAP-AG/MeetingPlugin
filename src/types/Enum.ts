export enum Permission {
    APPROVE = "Approve",
    SIGN = "Sign",
    RELEASE = "Release"
  }

export enum Task_Step_Status {
    Pending = "Pending",
    In_Progress = "In Progress",
    Complete = "Complete"
  }

export enum DocumentStatus {
    Draft= "Draft", 
    Approved= "Approved", 
    Signed= "Signed", 
    Released= "Released", 
}

export const taskStepStatusColors = {
    [Task_Step_Status.Pending]: { backgroundColor: "#fef08a", textColor: "#854D0E" },
    [Task_Step_Status.In_Progress]: { backgroundColor: "#bfdbfe", textColor: "#1e40af" },
    [Task_Step_Status.Complete]: { backgroundColor: "#bbf7d0", textColor: "#166534" },
};

export const documentStatusColors = {
    [DocumentStatus.Draft]: { backgroundColor: "#fef08a", textColor: "#854D0E" },
    [DocumentStatus.Approved]: { backgroundColor: "#bfdbfe", textColor: "#1e40af" },
    [DocumentStatus.Signed]: { backgroundColor: "#bbf7d0", textColor: "#166534" },
    [DocumentStatus.Released]: { backgroundColor: "#e9d5ff", textColor: "#6b21a8" },
};