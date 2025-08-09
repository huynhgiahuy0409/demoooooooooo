import { axios } from '../..';
import {
    AIResponse,
    DocGraphResponse,
    GetDocResponse,
    PromptListResponse,
    RuleBase,
} from './ApiService.type';

const getRuleManagementApi = (): Promise<{
    data: RuleBase[];
}> => {
    return new Promise((resolve, reject) => {
        axios
            .post('/get-rule-base', {
                requestId: `${Date.now()}`,
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const sendAI = (params: {
    data: {
        request: string;
        response: string;
        description: string;
    };
    config: {
        name: string;
        agentId: string;
        agentAlias: string;
        ruleId: string;
    };
}): Promise<AIResponse> => {
    return new Promise((resolve, reject) => {
        axios
            .post('/generate-docs', {
                requestId: `${Date.now()}`,
                ...params,
            })
            .then(response => {
                console.log('Response from sendAI:', response);
                resolve(response.data as AIResponse);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const getPromptHistory = (params: {
    page: number;
    pageSize: number;
}): Promise<PromptListResponse> => {
    return new Promise((resolve, reject) => {
        axios
            .post('/get-prompt-history', {
                requestId: `${Date.now()}`,
                offset: params.page - 1,
                limit: params.pageSize,
            })
            .then(response => {
                console.log('Response from getPromptHistory:', response);
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error in getPromptHistory:', error);
                reject(error);
            });
    });
};

const getDocData = (docId: string): Promise<GetDocResponse> => {
    return new Promise((resolve, reject) => {
        axios
            .post('/get-docs', {
                requestId: `${Date.now()}`,
                docId,
            })
            .then(response => {
                console.log('Response from getDocData:', response);
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error in getDocData:', error);
                reject(error);
            });
    });
};

const updateDocData = (params: {
    docId?: string;
    docData: string;
    name: string;
}): Promise<void> => {
    const { docId, docData, name } = params;
    ``;
    return new Promise((resolve, reject) => {
        axios
            .post('/update-docs', {
                requestId: `${Date.now()}`,
                docId,
                docData,
                name,
            })
            .then(() => {
                resolve();
            })
            .catch(error => {
                console.error('Error in updateDocData:', error);
                reject(error);
            });
    });
};

const getDocGraph = (docId: string): Promise<DocGraphResponse> => {
    return new Promise((resolve, reject) => {
        axios
            .post('/get-graph-doc', {
                requestId: `${Date.now()}`,
                docId,
            })
            .then(response => {
                console.log('Response from getDocGraph:', response);
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error in getDocGraph:', error);
                reject(error);
            });
    });
};

export const ApiService = {
    getRuleManagementApi,
    sendAI,
    getPromptHistory,
    getDocData,
    updateDocData,
    getDocGraph,
};
