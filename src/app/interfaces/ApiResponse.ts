export interface ApiResponse {
  info:    Info;
  results: Character[];
}

export interface Info {
  count: number;
  pages: number;
  next:  string | null;
  prev:  string | null;
}

export interface Character {
  id:     number;
  name:   string;
  status: string;
  species: string;
  type:   string;
  gender: string;
  image:  string;
  origin?: { name: string; url: string };
  location?: { name: string; url: string };
  episode?: string[];
}
