class Customer_anemico {

    // Entidade Anemica. Tem uma estrutura similar a um DTO.
    // Parece uma estrutura realizada para servir a um ORM, sem regra do negócio.

    _id: string;
    _name: string;
    _address: string;

    constructor(id: string, name: string, address: string) {
        this._id = id;
        this._name = name;
        this._address = address;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get address(): string {
        return this._address;
    }

    set name (name: string) {
        this._name = name;    
    }

    set address(address: string) {
        this._address = address;
    }


}