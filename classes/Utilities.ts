class Utilities {
    public static toRecord(entity: Record<string, any>): Record<string, string> {
        let record: Record<string, string> = {};
        for (const prop of Object.getOwnPropertyNames(entity)) {
            if (entity[prop]) {
                record[prop] = String(entity[prop]);
            }
        }
    
        return record;
    }
}

export default Utilities;