export const isEmptyObject = (object: Object) =>
    Object.entries(object).length === 0;


type MongoDataObject = {
    _id: string;
} & any

export const mapMongoObjectIdToId = (payload: MongoDataObject | Array<MongoDataObject>) => {
    if (Array.isArray(payload)) {
        return payload.map(p => {
            const {_id: id, ...rest} = p;

            return {
                id,
                ...rest
            }
        })
    }

    const {_id: id, ...rest} = payload;
    return {
        id,
        ...rest
    }
}
