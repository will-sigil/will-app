import { useEffect, useState } from "react";

import { Box, CircularProgress } from "@mui/material"
import { Logout } from '../Auth/Logout/Logout';
import { Header } from "../common/Header/Header";
import { Standings } from './Standings';

import { firestore } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";


import { StandingsCollection } from "../../types/db";
type DashboardProps = {

}
export const Dashboard : React.FC<DashboardProps> = ( ) => {
    const [data, setData] = useState<StandingsCollection[]>([]);
    const [loading, setLoading] = useState<boolean>(true); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'hockey'));
                const newData: StandingsCollection[] = [];
                querySnapshot.forEach((doc) => {
                    // Add each document's data to newData array
                    newData.push({ ...doc.data() as StandingsCollection });
                });
                setData(newData);
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        }
        fetchData();
    }, [setData])
    console.log(`DASHBOARD: ${data}`);
    return (
        <Box>
            <Header />
            {loading ? ( // Display loading indicator if data is being fetched
                <CircularProgress />
            ) : (
                <Standings standings={data[0] } />
            )}
            <Logout />
        </Box>
    )
}