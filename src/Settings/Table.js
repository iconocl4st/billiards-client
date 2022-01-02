// import React from 'react';
// import useAxios from 'axios-hooks';
// import axios from 'axios';
// import _ from 'lodash';
// import {Point} from "../../Common";
// import {SINGLE_COMP_STYLE} from "../../styles";
// import {URLS} from "../../Apis";
// import {Ball} from "./Balls";
//
//
// // {position: 'absolute', left: '0%', width: '100%'}
// // style={{position: 'absolute', top: SINGLE_COMP_STYLE.top, height: 'auto', width: '100%'}}
// const PoolConfiguration = () => {
// 	const [{data, loading, error}, refetch] = useAxios(URLS.config);
// 	const putData = createPutData(_.get(data, 'config', {}));
// 	const sendPutData = async () => {
// 		await axios.put(URLS.config, putData);
// 		await refetch();
// 	}
// 	return (
// 		<>
// 			<BallsConfig
// 				balls={putData.table.balls}
// 				setBall={async (index, b) => {
// 					putData.table.balls[index] = {...putData.table.balls[index], ...b};
// 					await sendPutData();
// 				}}
// 			/>
// 			<PocketsConfig
// 				pockets={putData.table.pockets}
// 				setPocket={async (index, p) => {
// 					putData.table.pockets[index] = {...putData.table.pockets[index], ...p};
// 					await sendPutData();
// 				}}
// 			/>
// 		</>
// 	);
// };
//
// export default PoolConfiguration;
