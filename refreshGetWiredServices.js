import {LightningElement,api,wire} from 'lwc';
import {getRecord,getFieldValue} from 'lightning/uiRecordApi';
import {updateRecord} from 'lightning/uiRecordApi';

import NAME from '@salesforce/schema/Account.Name';
import PHONE from '@salesforce/schema/Account.Phone';
import ORDER_DETAILS from '@salesforce/schema/Account.OrderDetails__c';
import RECORD_ID from '@salesforce/schema/Account.Id';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class RefreshGetWiredServices extends LightningElement{

    @api recordId;
    @api objectApiName;
    recordData;
    showSpinner = false;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: [NAME,PHONE,ORDER_DETAILS]
    })
    wiredAccount({error, data}){

        if(data){
            
            this.recordData = data;
            this.showSpinner = false;
            this.resetingValue();

        }else{

            console.log('Error=====',error);
        }
    }

    handleSave(){

        this.showSpinner = true;
        const fields = {};
        fields[RECORD_ID.fieldApiName] = this.recordId;
        fields[NAME.fieldApiName] =  this.template.querySelector("[data-field='Name']").value;
        fields[ORDER_DETAILS.fieldApiName] =  this.template.querySelector("[data-field='Order_Details']").value;

        const recordInput = {fields};
        updateRecord(recordInput)
        .then(() => {
            this.showSpinner = false;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Record updated',
                    variant: 'success'
                })
            );
        })
        .catch(error => {
            this.showSpinner = false;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });



    }

    resetingValue(){

        this.template.querySelector("[data-field='Name']").value = this.recordData ? getFieldValue(this.recordData, NAME) : '';
        this.template.querySelector("[data-field='Phone']").value = this.recordData ? getFieldValue(this.recordData, PHONE) : '';
        this.template.querySelector("[data-field='Order_Details']").value = this.recordData ? getFieldValue(this.recordData, ORDER_DETAILS) : '';
    }



}