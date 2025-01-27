export interface WizytaModel{
    id_wizyty: number,
    data_wizyty: string,
    nazwa_placowki?: string;
    adres_placowki: string,
    uczestnik: string,
    specjalizacja?: string;
    za_ile_dni?: number;
}