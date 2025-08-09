export type RuleBase = {
    ruleId: string;
    ruleName: string;
    ruleDescription: string;
    rulePath: string;
    status: string;
    createdAt: number;
    updatedAt: number;
    team: string;
    project: string;
    division: string;
};

export type AIResponse = {
    docData: string;
    docId: string;
};

export type PromptDocument = {
    docId: string;
    path: string;
    createdBy: string;
    createdAt: string;
    version: string;
    status: 'ACTIVED' | 'PENDING' | 'INACTIVE';
    ruleId?: string;
};

export interface PromptListResponse {
    historyList: PromptDocument[];
    total: number;
}

export type GetDocResponse = {
    docData: string;
    name?: string;
};

export type DocNode = {
    docId: string;
    latestId: string;
    name: string;
    description: string;
    createdBy: string;
    createdAt: string;
    version: string;
    status: string;
    parentId?: string;
    ruleId: string;
    childrenList: DocNode[];
};

export type DocGraphResponse = {
    node: DocNode;
};
