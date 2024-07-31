import React from 'react'
import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const List = () => {
  const rows = [
    {
      id: 10000001,
      product: "Item 01",
      img: "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      customer: "Kamal",
      date: "2024-01-01",
      amount: 785,
      method: "Cash on Delivery",
      status: "Approved",
    },
    {
      id: 20000002,
      product: "Item 02",
      img: "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      customer: "Amal",
      date: "2024-01-01",
      amount: 900,
      method: "Online Payment",
      status: "Pending",
    },
    {
      id: 30000003,
      product: "Item 03",
      img: "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      customer: "Nimal",
      date: "2024-01-01",
      amount: 35,
      method: "Cash on Delivery",
      status: "Pending",
    },
    {
      id: 40000004,
      product: "Item 04",
      img: "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      customer: "Namal",
      date: "2024-01-01",
      amount: 920,
      method: "Online",
      status: "Approved",
    },
    {
      id: 50000005,
      product: "Item 05",
      img: "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      customer: "Pamal",
      date: "2024-01-01",
      amount: 2000,
      method: "Online",
      status: "Pending",
    },
  ];
  return (
    
    <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell className="tableCell">Tracking ID</TableCell>
                <TableCell className="tableCell">Product</TableCell>
                <TableCell className="tableCell">Customer</TableCell>
                <TableCell className="tableCell">Date</TableCell>
                <TableCell className="tableCell">Amount</TableCell>
                <TableCell className="tableCell">Payment Method</TableCell>
                <TableCell className="tableCell">Status</TableCell>
            </TableRow>
            </TableHead>

            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.id}>
                    <TableCell className="tableCell">{row.id}</TableCell>
                    <TableCell className="tableCell">
                        <div className="cellWrapper">
                        <img src={row.img} alt="" className="image" />
                        {row.product}
                        </div>
                    </TableCell>
                    <TableCell className="tableCell">{row.customer}</TableCell>
                    <TableCell className="tableCell">{row.date}</TableCell>
                    <TableCell className="tableCell">{row.amount}</TableCell>
                    <TableCell className="tableCell">{row.method}</TableCell>
                    <TableCell className="tableCell">
                        <span className={`status ${row.status}`}>{row.status}</span>
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
  );
};

export default List;