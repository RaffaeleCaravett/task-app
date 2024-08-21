export interface Interfaces {
}

export interface Tasks {
    title: string,
    description: string,
    status: string,
    user: string,
    id: string
};
export interface Task {
  title: string,
  description: string,
  status: string,
  user: string
};
export interface cities {
    id:number,
    name: string,
    regione: string,
    cap: number
};
export interface regions {
  id: number,
  name: string,
  citta: string
};
export interface cap {
  id: number,
    citta: string,
    cap: number
};
export interface userLogged{
    id: string,
    nome: string,
    cognome: string,
    citta: string,
    regione: string,
    cap: string,
    email: string,
    password: string,
    sex: string
};
export interface userSignup{
      nome: string,
      cognome: string,
      citta: string,
      regione: string,
      cap: string,
      email: string,
      password: string,
      sex: string
  };
  export interface userLogin{
    email:string,
    password:string
  };
export interface status{
   id: number,
    nome: string
};
export interface taskAttributes{
   id: number,
    value: string
};
export interface directions{
  id: number,
    value: string
};
export interface elements{
  id: number,
  value: number
};
