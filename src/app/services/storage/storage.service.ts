import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;
const builderConfig = require('../../../builder/builder.config.json');

@Injectable({
  providedIn: 'root'
})
export class StorageService {
	
  storage_key_prefix: string = builderConfig.clientAppName.substring(0, 4);	

  constructor() { }

    /**
   * Retrieves the value of the specified key from storage.
   * 
   * @param key 
   * @returns 
   */
  async get(key: string): Promise<any> 
    {
          key=this.storage_key_prefix+''+key;
          const item = await Storage.get({ key: key });
          return JSON.parse(item.value);
    }
    /**
     * Stores the specified key value pair in storage.
     * 
     * @param key 
     * @param value 
     */
  async set(key: string, value: any): Promise<void> 
  {
        key=this.storage_key_prefix+''+key;
        await Storage.set({
          key: key,
          value: JSON.stringify(value)
        });
  }
      /**
     * Removes the specified key from storage.
     * 
     * @param key 
     */
  async remove(key: string): Promise<void> 
    {
          key=this.storage_key_prefix+''+key;
          await Storage.remove({
            key: key
          });
    }

}
