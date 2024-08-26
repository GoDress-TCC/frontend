export type Category = {
    _id: string;
    name: string
};

export type Clothing = {
    _id: string,
    catId: string,
    image: string,
    kind: string,
    color: string,
    fit: string,
    gender: string,
    tissue: string,
    fav: boolean
}
