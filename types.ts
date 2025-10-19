export interface Candidate {
  id: number;
  name: string;
  imageUrl?: string;
}

export interface PollResults {
  [key: number]: number;
}