export interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
  prefix: string;
}

export interface UpdateServiceRequest {
  prefix: string;
}


