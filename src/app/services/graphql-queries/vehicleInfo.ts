import { gql } from 'apollo-angular';

export const GET_VEHICLES_PAGINATED = gql`
  query GetVehiclesPaginated($paginationInput: PaginationInput!) {
    getVehiclesPaginated(paginationInput: $paginationInput) {
      total
      page
      pageSize
      data {
        id
        vin
        first_name
        last_name
        email
        car_make
        car_model
        manufactured_date
        age_of_vehicle
      }
    }
  }
`;

export const SEARCH_VEHICLE_BY_MODEL = gql`
  query SearchVehicleByModel($keyword: String!) {
    searchVehicleByModel(keyword: $keyword) {
      id
      vin
      first_name
      last_name
      email
      car_make
      car_model
      manufactured_date
      age_of_vehicle
    }
  }
`;

export const DELETE_VEHICLE = gql`
  mutation RemoveVehicleInfo($id: Int!) {
    removeVehicleInfo(id: $id) {
      vin
      first_name
      last_name
      email
      car_make
      car_model
      manufactured_date
      age_of_vehicle
    }
  }
`;



export const UPDATE_VEHICLE = gql`
  mutation UpdateVehicleInfo($updateVehicleInfoInput: UpdateVehicleInfoInput!) {
    updateVehicleInfo(updateVehicleInfoInput: $updateVehicleInfoInput) {
      vin
      first_name
      last_name
      email
      car_make
      car_model
      manufactured_date
      age_of_vehicle
    }
  }
`;

