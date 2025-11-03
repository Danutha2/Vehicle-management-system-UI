import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GET_ALL_VEHICLE_INFO, GET_VEHICLE_INFO_BY_VIN } from './graphql-queries/vehicleInfo';
import { CREATE_VEHICLE_RECORD, DELETE_VEHICLE_RECORD, GET_ALL_VEHICLE_RECORDS, GET_VEHICLE_RECORD_BY_ID, UPDATE_VEHICLE_RECORD } from './graphql-queries/vehicleServiceRecord';

@Injectable({
  providedIn: 'root'
})
export class VehicleRecordService { 
  constructor(private apollo: Apollo) { }

  /**
   * Fetch all vehicles with basic information for dropdown
   */
  getAllVehicles(): Observable<any[]> {
    return this.apollo.watchQuery<any>({
      query: GET_ALL_VEHICLE_INFO,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(res => res.data.allVehicleInfo)
    );
  }

  /**
   * Fetch complete vehicle information with all fields by VIN
   * Used for direct VIN search
   */
  getVehicleByVIN(vin: string): Observable<any> {
    return this.apollo.query<any>({
      query: GET_VEHICLE_INFO_BY_VIN,
      variables: { vin },
      fetchPolicy: 'network-only'
    }).pipe(
      map(res => res.data.vehicleInfo)
    );
  }

  /**
   * Fetch vehicle with only selected fields (dynamic query)
   * Used for dropdown selection with custom field selection
   */
  getVehicleWithSelectedFields(
    vin: string, 
    vehicleFields: string[], 
    recordFields: string[]
  ): Observable<any> {
    if (!vin || !vin.trim()) {
      throw new Error('VIN is required');
    }
    
    if (!vehicleFields || vehicleFields.length === 0) {
      throw new Error('At least one vehicle field must be selected');
    }

    if (!recordFields || recordFields.length === 0) {
      throw new Error('At least one record field must be selected');
    }

    const vehicleQueryFields = vehicleFields.join('\n            ');
    const recordQueryFields = recordFields.join('\n              ');

    const dynamicQuery = gql`
      query VehicleWithSelectedFields($vin: String!) {
        vehicleInfo(vin: $vin) {
          ${vehicleQueryFields}
          serviceRecord {
            ${recordQueryFields}
          }
        }
      }
    `;

    console.log('Dynamic Query Generated:', dynamicQuery);

    return this.apollo.query<any>({
      query: dynamicQuery,
      variables: { vin },
      fetchPolicy: 'network-only'
    }).pipe(
      map(res => res.data.vehicleInfo)
    );
  }

  // ==================== SERVICE RECORD CRUD OPERATIONS ====================

  /**
   * Get all service records
   */
  getAllRecords(): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: GET_ALL_VEHICLE_RECORDS,
      fetchPolicy: 'network-only'
    }).valueChanges;
  }

  /**
   * Get a single service record by ID
   */
  getRecordById(id: number): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: GET_VEHICLE_RECORD_BY_ID,
      variables: { id },
      fetchPolicy: 'network-only'
    }).valueChanges;
  }

  /**
   * Create a new service record
   * @param recordInput - Must contain: vin, date, description, performed_by
   */
  createRecord(recordInput: any): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_VEHICLE_RECORD,
      variables: { createVehicleRecordInput: recordInput },
      refetchQueries: ['VehicleRecords']
    });
  }

  /**
   * Update an existing service record
   * @param recordInput - Must contain: id, vin, date, description, performed_by
   */
  updateRecord(recordInput: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_VEHICLE_RECORD,
      variables: { updateVehicleRecordInput: recordInput },
      refetchQueries: ['VehicleRecords']
    });
  }

  /**
   * Delete a service record by ID
   * @param id - Record ID to delete
   */
  deleteRecord(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation:DELETE_VEHICLE_RECORD,
      variables: { id },
      refetchQueries: ['VehicleRecords']
    });
  }

  /**
   * Get all service records for a specific VIN
   */
  getServiceRecordsByVIN(vin: string): Observable<any[]> {
    return this.apollo.query<any>({
      query: GET_VEHICLE_INFO_BY_VIN,
      variables: { vin },
      fetchPolicy: 'network-only'
    }).pipe(
      map(res => res.data.vehicleInfo.serviceRecord)
    );
  }

  /**
   * Validate if a VIN exists in the system
   */
  validateVIN(vin: string): Observable<boolean> {
    return this.getAllVehicles().pipe(
      map(vehicles => vehicles.some(v => v.vin === vin))
    );
  }
}

