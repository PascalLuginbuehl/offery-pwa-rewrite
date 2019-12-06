// {
//   /* Navigation */
// }
// {
//   portal
//     ? ReactDOM.createPortal(
//         <>
//           <ListSubheader>
//             <FormattedMessage id="EDIT_LEAD" />
//           </ListSubheader>
//           <NavFolder to={`${match.url}/building`} title="CUSTOMER">
//             {Lead ? (
//               <>
//                 <Collapse in={Lead.HasMoveOutBuilding}>
//                   <NavItem to={`${match.url}/building/move-out`} title="MOVE_OUT_BUILDING" nested />
//                 </Collapse>
//                 <Collapse in={Lead.HasMoveInBuilding}>
//                   <NavItem to={`${match.url}/building/move-in`} title="MOVE_IN_BUILDING" nested />
//                 </Collapse>
//                 <Collapse in={Lead.HasStorageInBuilding}>
//                   <NavItem to={`${match.url}/building/storage`} title="STORAGE_BUILDING" nested />
//                 </Collapse>
//                 <Collapse in={Lead.HasDisposalOutBuilding}>
//                   <NavItem to={`${match.url}/building/disposal`} title="DISPOSAL_BUILDING" nested />
//                 </Collapse>
//                 <Collapse in={Lead.HasCleaningBuilding}>
//                   <NavItem to={`${match.url}/building/cleaning`} title="CLEANING_BUILDING" nested />
//                 </Collapse>
//                 <NavItem to={`${match.url}/building/email-confirmation`} title="EMAIL_CONFIRMATION" nested />
//               </>
//             ) : null}
//           </NavFolder>

//           <NavFolder to={`${match.url}/services`} title="SERVICES">
//             <Collapse in={services.HasMoveServiceEnabled}>
//               <NavFolder to={`${match.url}/services/move`} title="MOVE" nested>
//                 <NavItem to={`${match.url}/services/move/material-shop`} title="MATERIAL_SHOP" doubleNested />
//                 <NavItem to={`${match.url}/services/move/inventory`} title="INVENTORY" doubleNested />
//               </NavFolder>
//             </Collapse>

//             <Collapse in={services.HasPackServiceEnabled}>
//               <NavFolder to={`${match.url}/services/pack`} title="PACK" nested>
//                 <NavItem to={`${match.url}/services/pack/material-shop`} title="MATERIAL_SHOP" doubleNested />
//               </NavFolder>
//             </Collapse>

//             <Collapse in={services.HasStorageServiceEnabled}>
//               <NavFolder to={`${match.url}/services/storage`} title="STORAGE" nested>
//                 <NavItem to={`${match.url}/services/storage/material-shop`} title="MATERIAL_SHOP" doubleNested />
//                 <NavItem to={`${match.url}/services/storage/inventory`} title="INVENTORY" doubleNested />
//               </NavFolder>
//             </Collapse>

//             <Collapse in={services.HasDisposalServiceEnabled}>
//               <NavFolder to={`${match.url}/services/disposal`} title="DISPOSAL" nested>
//                 <NavItem to={`${match.url}/services/disposal/inventory`} title="INVENTORY" doubleNested />
//               </NavFolder>
//             </Collapse>

//             <Collapse in={services.HasCleaningServiceEnabled}>
//               <NavItem to={`${match.url}/services/cleaning`} title="CLEANING" nested />
//             </Collapse>
//           </NavFolder>

//           <NavFolder to={`${match.url}/conditions`} title="CONDITIONS">
//             <Collapse in={services.HasCleaningServiceEnabled}>
//               <NavItem to={`${match.url}/conditions/move`} title="MOVE_CONDITIONS" nested />
//             </Collapse>

//             <Collapse in={services.HasPackServiceEnabled}>
//               <NavItem to={`${match.url}/conditions/pack`} title="PACK_CONDITIONS" nested />
//             </Collapse>

//             <Collapse in={services.HasStorageServiceEnabled}>
//               <NavItem to={`${match.url}/conditions/storage`} title="STORAGE_CONDITIONS" nested />
//             </Collapse>

//             <Collapse in={services.HasDisposalServiceEnabled}>
//               <NavItem to={`${match.url}/conditions/disposal`} title="DISPOSAL_CONDITIONS" nested />
//             </Collapse>

//             <Collapse in={services.HasCleaningServiceEnabled}>
//               <NavItem to={`${match.url}/conditions/cleaning`} title="CLEANING_CONDITIONS" nested />
//             </Collapse>
//           </NavFolder>

//           <NavFolder to={`${match.url}/offer`} title="OFFER">
//             <Collapse in={services.HasCleaningServiceEnabled}>
//               <NavItem to={`${match.url}/offer/generate`} title="GENERATE" nested />
//             </Collapse>

//             <Collapse in={services.HasPackServiceEnabled}>
//               <NavItem to={`${match.url}/offer/preview`} title="PREVIEW" nested />
//             </Collapse>
//           </NavFolder>
//         </>,
//         portal
//       )
//     : null
// }
export const test = 1
