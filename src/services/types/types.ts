export type User = {
    _id: string;
    name: string;
    surname: string;
    email: string;
    gender: string;
};

export type Category = {
    _id: string;
    name: string
};

export type Clothing = {
    _id: string;
    catId: string;
    image: string;
    kind: string;
    type: string;
    color: string;
    style: string;
    temperature: string;
    gender: string;
    tissue: string;
    fav: boolean;
    dirty: boolean
};

export type Outfit = {
    _id: string;
    clothingId: Clothing[];
    name: string;
    catId: string;
    style: string;
    temperature: string;
    hour: string
}

export type Event = {
    _id: string;
    image: string;
    name: string;
    date: string;
    local: string;
    outfitId: string;
};