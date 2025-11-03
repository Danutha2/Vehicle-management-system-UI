import { gql } from 'apollo-angular';

export const GET_ALL_VEHICLE_RECORDS = gql`
  query VehicleRecords {
    vehicleRecords {
      id
      vin
      date
      description
      performed_by
    }
  }
`;

export const GET_VEHICLE_RECORD_BY_ID = gql`
  query VehicleRecordById($id: Int!) {
    vehicleRecordById(id: $id) {
      id
      vin
      date
      description
      performed_by
    }
  }
`;

export const CREATE_VEHICLE_RECORD = gql`
  mutation CreateVehicleRecord($createVehicleRecordInput: CreateVehicleRecordInput!) {
    createVehicleRecord(createVehicleRecordInput: $createVehicleRecordInput) {
      id
      vin
      date
      description
      performed_by
    }
  }
`;

export const UPDATE_VEHICLE_RECORD = gql`
  mutation UpdateVehicleRecord($updateVehicleRecordInput: UpdateVehicleRecordInput!) {
    updateVehicleRecord(updateVehicleRecordInput: $updateVehicleRecordInput) {
      id
      vin
      date
      description
      performed_by
    }
  }
`;

export const DELETE_VEHICLE_RECORD = gql`
  mutation RemoveVehicleRecord($id: Int!) {
    removeVehicleRecord(id: $id)
  }
`;


export const GET_VEHICLE_INFO_BY_VIN = gql`
  query VehicleInfo($vin: String!) {
    vehicleInfo(vin: $vin) {
      id
      vin
      first_name
      last_name
      email
      car_make
      car_model
      manufactured_date
      age_of_vehicle
      serviceRecord {
        id
        vin
        date
        description
        performed_by
      }
    }
  }
`;

export const GET_ALL_VEHICLE_INFO = gql`
  query AllVehicleInfo {
    allVehicleInfo {
      id
      first_name
      last_name
      email
      car_make
      car_model
      vin
      manufactured_date
      age_of_vehicle
    }
  }
`;


