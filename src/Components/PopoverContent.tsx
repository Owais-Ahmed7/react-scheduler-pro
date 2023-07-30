// import React, { useState } from "react";

// //redux
// import { useSelector } from "react-redux";

// const PopoverContent = (props) => {
//   const appoint = props.item;
//   const opdBills = useSelector((state) => state.opdBill.bills);

//   const invoicedBill = opdBills?.find(
//     (document) => document.appointId === appoint._id
//   );

  
//   //toggle print
//   const [invoicePrint, setInvoicePrint] = useState(false);
//   const togglePrint = () => setInvoicePrint(!invoicePrint);

//   let printBill = undefined;
//   if (invoicedBill) {
//     printBill = { ...invoicedBill, patient: appoint.patient };
//   }

//   return (
//     <React.Fragment>
//       <div>
//         <div className="d-flex justify-content-end align-items-center">
//           {!appoint.isCancelled && (
//             <button type="button" className="btn btn-light btn-sm">
//               <i className="ri-file-copy-line"></i>
//             </button>
//           )}
//           {!appoint.isCancelled && (
//             <button
//               onClick={() => {
//                 props.toggleForm();
//                 props.setEditAppoint(appoint);
//               }}
//               type="button"
//               className="btn btn-light ms-2 btn-sm"
//             >
//               <i className="ri-quill-pen-line fs-8"></i>
//             </button>
//           )}
//           {!appoint.isCancelled && (
//             <button
//               onClick={() => {
//                 props.setCancelAppoint(appoint);
//                 props.toggleCancelModal();
//               }}
//               type="button"
//               className="btn btn-light ms-2 btn-sm"
//             >
//               <i className="ri-close-circle-line text-danger"></i>
//             </button>
//           )}
//           {appoint.isCancelled && (
//             <div className="text-muted me-2 text-warning">Cancelled</div>
//           )}
//           {appoint.isCancelled && (
//             <button
//               onClick={() => {
//                 props.setCancelAppoint(appoint);
//                 props.setCnlDltModal((prevValue) => ({
//                   ...prevValue,
//                   deleteModal: true,
//                 }));
//                 // props.toggleDeletelModal();
//               }}
//               type="button"
//               className="btn btn-light ms-2 btn-sm"
//             >
//               <i className="ri-delete-bin-6-line fs-8"></i>
//             </button>
//           )}
//         </div>
//         <div className="patient?-profile">
//           {/* <Button
//           id='profilePopover'
//           type='button'
//           className='p-0 btn-light me-3 rounded-circle shadow-none'
//         > */}
//           <img
//             className="rounded-circle avatar-smm me-2 header-profile-user"
//             src={
//               "//www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?s=200&r=pg&d=mm"
//             }
//             alt="Patient Avatar"
//           />
//           {/* </Button> */}
//           <div>
//             <h5 className="font-semi-bold text-capitalize font-size-16">
//               {appoint?.patient?.firstName || "Patient Name"}
//             </h5>
//             <div className="font-size-14">
//               <span>{appoint?.patient?.gender || "Gender"}</span>
//               <span>|</span>
//               <span>
//                 {appoint?.patient?.dateOfBirth ? (
//                   <Moment fromNow ago>
//                     {appoint?.patient?.dateOfBirth}
//                   </Moment>
//                 ) : (
//                   "Date of birth"
//                 )}
//               </span>
//               <span>|</span>
//               <span>Blood Group</span>
//             </div>
//           </div>
//         </div>
//         <div className="text-muted mt-3">
//           <div>{appoint?.patient?.phoneNumber || "Patient Phone Number"}</div>
//           <div>{appoint?.patient?.email || "Patient Email"}</div>
//         </div>
//         <div className="d-flex justify-content-between pt-1 pb-1 mt-3 align-items-center border-top border-bottom">
//           <div className="text-muted w-50">
//             In-Clinic Appointment with Dr.{appoint?.doctor?.name} at{" "}
//             {appoint?.time} for 15 mins
//           </div>
//           <div>
//             <button className="btn btn-light btn-sm">No Show</button>
//           </div>
//         </div>
//         <div>
//           <h5 className="font-semi-bold mt-3 text-capitalize font-size-16">
//             Medical History
//           </h5>
//           <p className="text-muted">Heart Disease</p>
//         </div>
//         <div className="d-flex justify-content-end">
//           <button
//             onClick={(e) => {
//               props.setPatient(appoint?.patient);
//               props.setAppointId(appoint._id);
//               props.togglePresc(e);
//             }}
//             disabled={appoint.isCancelled}
//             // style={{ pointerEvents: 'auto' }}
//             className="btn btn-primary btn-sm me-2 text-nowrap fs-10"
//           >
//             Create Prescription
//           </button>
//           {invoicedBill ? (
//             <button
//               onClick={() => {
//                 togglePrint();
//               }}
//               className="btn btn-primary btn-sm text-nowrap fs-10"
//             >
//               View Invoice
//             </button>
//           ) : (
//             <button
//               onClick={(e) => {
//                 props.setPatient(appoint?.patient);
//                 props.toggleInvoice(e);
//                 props.setAppointId(appoint._id);
//               }}
//               disabled={appoint.isCancelled}
//               // style={{ pointerEvents: 'auto' }}
//               className="btn btn-primary btn-sm text-nowrap fs-10"
//             >
//               Collect Payment
//             </button>
//           )}
//         </div>
//         <Print
//           type={"opd-invoice"}
//           printData={printBill}
//           modal={invoicePrint}
//           toggle={togglePrint}
//         />
//       </div>
//     </React.Fragment>
//   );
// };

// export default PopoverContent;
