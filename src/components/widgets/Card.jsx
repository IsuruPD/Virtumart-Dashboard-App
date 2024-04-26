import React from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import PaymentsIcon from '@mui/icons-material/Payments';
import BadgeIcon from '@mui/icons-material/Badge';
import "./card.scss";

const Card = ({type}) => {

    let data;

    /////
    const amount=100;
    const diff=20;

    switch(type){
        case "users":
            data={
                title: "Users",
                isMoney: false,
                link: "Go to User Management",
                icon: <PersonIcon className="cardIcon"/>
            };
            break;
        case "orders":
            data={
                title: "Orders",
                isMoney: false,
                link: "Go to Order Management",
                icon: <InventoryIcon className="cardIcon"/>
            };
            break;  
        case "analytics":
            data={
                title: "Analytics",
                isMoney: true,
                link: "Go to Accounts Management",
                icon: <PaymentsIcon className="cardIcon"/>
            };
            break; 
        case "employees":
            data={
                title: "Employees",
                isMoney: false,
                link: "Go to Employee Management",
                icon: <BadgeIcon className="cardIcon"/>
            };
            break;     
        default:
            break;    
    }

    return (
        <div className="widgetCard">
            <div className="left">
                <span className='title'>{data.title}</span>
                <span className='counter'>{data.isMoney && "Rs."}{amount}</span>
                <span className='link'>{data.link}</span>
            </div>
            <div className="right">
                <div className="percentage positive">
                    <KeyboardArrowUpIcon/>
                    {diff}%
                </div>
                {data.icon}
            </div>
        </div>
    )
}

export default Card