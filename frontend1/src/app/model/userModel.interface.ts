export interface UserModel{
    id: number,
    login: string,
    haslo?: string;
    rola: string,
    imie: string,
    nazwisko: string,
    placowki?: number[];
    specjalizacja?: string;
}

export interface UserDto{
    id: number,
    login: string,
    rola: string,
    imie: string,
    nazwisko: string,
    placowki?: string;
    specjalizacja?: string;
}
  