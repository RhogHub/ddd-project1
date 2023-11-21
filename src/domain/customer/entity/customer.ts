/*
*   Notes:
*/
// Complexidade de negócio
// DOMAIN 
// - Entity 
//   -- Customer.ts (regra de negócio)

// Complexidade acidental
// infra - mundo externo
// - Entity / model 
// -- Customer.ts (get,set) - ORM

// Entidade Anemica. Tem uma estrutura similar a um DTO.
// Parece uma estrutura realizada para servir a um ORM, sem regra do negócio.

// Mudança de regra - Faz parte da regra de negocio.
// Modelagem rica de dominio e não apenas getters and setters.

import Address from "../value-object/address";

export default class Customer {
    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = true;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;   
        this.validate();     
    }

    get id(): string {
        return this._id;
    }
    
    get name(): string {
        return this._name;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
    }
    
    changeName(name: string) {
        this._name = name;

        this.validate();
    }

    get Address(): Address {
        return this._address;
    }
      
    changeAddress(address: Address) {
        this._address = address;
    }

    isActive(): boolean {
        return this._active;
    }

    activate() {
        if (this._address === undefined) {
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }
   
    set Address(address: Address){
        this._address = address;
    }

}