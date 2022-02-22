abstract class Recordable {
    toRecord(): Record<string, string> {
        let record: Record<string, string> = {};
        for (const prop of Object.getOwnPropertyNames(this)) {
            if (this[prop]) {
                record[prop] = String(this[prop]);
            }
        }
    
        return record;
    }
}

export default Recordable;