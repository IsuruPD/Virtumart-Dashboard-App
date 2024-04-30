
  //Fetch table columns dynamically
  /* 
  
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';

const StaffDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'employees'));
      const employeeData = [];
      querySnapshot.forEach((doc) => {
        employeeData.push({ id: doc.id, ...doc.data() });
      });

      // Set employees state with updated data including row number
      setEmployees(employeeData);

      // Define columns dynamically
      const firstEmployee = employeeData[0];
      if (firstEmployee) {
        const employeeKeys = Object.keys(firstEmployee);
        const formattedColumns = [
          { field: 'id', headerName: 'ID', width: 0 },
          ...employeeKeys
            .filter((key) => key !== 'id') // Exclude 'id' from columns
            .map((key) => ({
              field: key,
              headerName: key.charAt(0).toUpperCase() + key.slice(1),
              width: 150,
            })),
        ];

        setColumns(formattedColumns);
      }
    };

    fetchEmployees();
  }, []);


  */
