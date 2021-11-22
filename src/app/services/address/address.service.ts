import { Injectable } from '@angular/core';
import { Address } from 'src/app/interfaces/address.interface';
import { ApiConnectionService } from '../api-connection/api-connection.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  newAddressAdded:boolean;

  constructor(private ApiConnectionService:ApiConnectionService) { }

  addEditAddress(addressData: Address) 
    {
          let add_edit_address_url = '/mobile_app/v1/add_address';
                    if(addressData.address_id > 0)
                    {
                      add_edit_address_url='/mobile_app/v1/update_address';
                      
                    }
          const addEditAddress_fields = {
            address_info: JSON.stringify(addressData)
          };

          return this.ApiConnectionService.post({
            url: add_edit_address_url,
            postParams: addEditAddress_fields
          });
    }
}
