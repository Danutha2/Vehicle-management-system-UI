import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  GET_VEHICLES_PAGINATED,
  SEARCH_VEHICLE_BY_MODEL,
  DELETE_VEHICLE,
  UPDATE_VEHICLE,
} from '../services/graphql-queries/vehicleInfo';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  constructor(private apollo: Apollo) {}

  getPaginatedVehicles(page: number, pageSize: number = 2) {
    return this.apollo
      .watchQuery<any>({
        query: GET_VEHICLES_PAGINATED,
        variables: {
          paginationInput: { page, pageSize },
        },
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map((res) => res.data.getVehiclesPaginated));
  }

  searchVehicle(keyword: string) {
    return this.apollo
      .watchQuery<any>({
        query: SEARCH_VEHICLE_BY_MODEL,
        variables: { keyword },
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map((res) => res.data.searchVehicleByModel));
  }

  // FIX #2: Send ID as String
  deleteVehicle(id: number) {
    if (!id) throw new Error('Invalid ID for deletion');

    console.log('Service: Deleting with ID (as string):', id.toString());

    return this.apollo.mutate({
      mutation: DELETE_VEHICLE,
      variables: { id: Number(id) },
      errorPolicy: 'all',
    });
  }

  // FIX #2: Send ID as String and clean input
  updateVehicle(input: any) {
  // Build the input object dynamically
  const updateInput: any = {};
  
  if (input.vin !== undefined) updateInput.vin = input.vin;
  if (input.first_name !== undefined) updateInput.first_name = input.first_name;
  if (input.last_name !== undefined) updateInput.last_name = input.last_name;
  if (input.car_make !== undefined) updateInput.car_make = input.car_make;
  if (input.car_model !== undefined) updateInput.car_model = input.car_model;
  if (input.email !== undefined) updateInput.email = input.email;
  if (input.manufactured_date !== undefined) updateInput.manufactured_date = input.manufactured_date;
  if (input.age_of_vehicle !== undefined) updateInput.age_of_vehicle = input.age_of_vehicle;

  console.log('Service: Updating vehicle with VIN:', updateInput.vin, 'with data:', updateInput);

  return this.apollo.mutate({
    mutation: UPDATE_VEHICLE,
    variables: { 
      updateVehicleInfoInput: updateInput 
    },
    errorPolicy: 'all',
  });
}

}