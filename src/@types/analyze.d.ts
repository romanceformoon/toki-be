export interface IGraph {
  [count: string]: {
    [level: string]: number;
  };
}

export interface IHistory {
  [level: string]: {
    title: string;
    clear: string;
    exp: number;
    bp: number;
    rate: number;
    md5: string;
    level: string;
  }[];
}
