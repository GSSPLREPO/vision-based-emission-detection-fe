
export const commonData = [
    {
        id: 3,
        parentId: null,
        routeLink: 'admin',
        icon: 'fa-solid fa-user',
        label: 'Admin',
        expanded: false,
        items: [
            { id: 31,parentId: 3, label: 'Organization', routeLink: 'admin/organization'  },
            { id: 32,parentId: 3, label: 'Department', routeLink: 'admin/department'  },
            { id: 33,parentId: 3, label: 'Cost Center', routeLink: 'admin/cost-center'  },
            { id: 34,parentId: 3, label: 'User', routeLink: 'admin/user'  },
            { id: 35,parentId: 3, label: 'Employee', routeLink: 'admin/employee'  },
            { id: 36,parentId: 3, label: 'Roles', routeLink: 'admin/role'  },
            { id: 37,parentId: 3, label: 'Role Rights', routeLink: 'admin/role-right'  }
        ]
    },
  
    {
        id: 5,
        parentId: null,
        routeLink: 'location',
        icon: 'fa-solid fa-location',
        label: 'Location',
        expanded: false,
        items: [
            { id: 51,parentId: 5, label: 'Section', routeLink: 'location/section'  },
            { id: 52,parentId: 5, label: 'Area', routeLink: 'location/area'   }, 
            { id: 53,parentId: 5, label: 'Zone', routeLink: 'location/zone'   },
            { id: 54,parentId: 5, label: 'Aisle', routeLink: 'location/aisle'  },
            { id: 55,parentId: 5, label: 'Rack', routeLink: 'location/rack'  },
            { id: 56,parentId: 5, label: 'Shelf and Position', routeLink: 'location/shelf-position'  },
        ]
    },
]

export const navbarData: any[] = [
    {
        id: 1,
        parentId: null,
        routeLink: 'auditor-dashboard',
        icon: 'fa-solid fa-dashboard',
        label: 'Auditor Dashboard'
    },
    {
        id: 2,
        parentId: null,
        routeLink: 'user-dashboard',
        icon: 'fa-solid fa-home',
        label: 'User Dashboard'
    },
    {
        id: 4,
        parentId: null,
        routeLink: 'masters',
        icon: 'fa-solid fa-tags',
        label: 'Masters',
        // expanded: false,
        items: [
            { id: 41,parentId: 4, label: 'CWIP', routeLink: 'masters/cwip'  },
            { id: 42,parentId: 4, label: 'CWIP Entry', routeLink: 'masters/cwip-entry'  },
            { id: 43,parentId: 4, label: 'Transfer CWIP', routeLink: 'masters/transfer-cwip'  },
            { id: 44,parentId: 4, label: 'Asset Group', routeLink: 'masters/asset-group'  },
            { id: 45,parentId: 4, label: 'Asset Sub Group', routeLink: 'masters/asset-sub-group'  },
            { id: 46,parentId: 4, label: 'Asset', routeLink: 'masters/asset'  },
            { id: 47,parentId: 4, label: 'Depreciation Law', routeLink: 'masters/depreciation-method'  },
            { id: 48,parentId: 4, label: 'Audits', routeLink: 'masters/audit'  },
            { id: 49,parentId: 4, label: 'Sales/Scrap/Discard', routeLink: 'masters/sales-scrap-discard'  },
            { id: 50,parentId: 4, label: 'Device', routeLink: 'masters/Device' },
        ]
    },
    
    {
        id: 6,
        parentId: null,
        routeLink: 'operation',
        icon: 'fa-solid fa-toolbox',
        label: 'Operations',
        items: [
            { id: 61,parentId: 6, label: 'Asset Tag', routeLink: 'operation/link-asset-tag'  },
            { id: 62,parentId: 6, label: 'Link Asset Location', routeLink: 'operation/link-asset-loc/form'  },
            { id: 63,parentId: 6, label: 'Change Location', routeLink: 'operation/change-loc/form'  },
            { id: 64,parentId: 6, label: 'Calculate Depreciation', routeLink: 'operation/calculate-depreciation'  },
        ]
    },
    {
        id: 7,
        parentId: null,
        routeLink: 'reports',
        icon: 'fa-solid fa-file',
        label: 'Reports',
        // expanded: false,
        items: [
            { id: 71,parentId: 7, label: 'Asset Report', routeLink: 'reports/asset-report'  },
            { id: 72,parentId: 7, label: 'Asset Transit Report', routeLink: 'reports/asset-transit-report'  },
            { id: 73,parentId: 7, label: 'Asset Movement Report', routeLink: 'reports/asset-movement-report'  },
            { id: 74,parentId: 7, label: 'FAR', routeLink: 'reports/fixed-assets-register'  },
            // { id: 75,parentId: 7, label: 'Fixed Assets Summary', routeLink: 'reports/fixed-assets-summary-financial-report'  },
            { id: 75,parentId: 7, label: 'Tag Detail Report', routeLink: 'reports/tag-detail-report'  },
            { id: 76,parentId: 7, label: 'FAR Financials', routeLink: 'reports/fixed-assets-register-for-financials'  },
            { id: 77,parentId: 7, label: 'Depreciation Report', routeLink: 'reports/depreciation-report'  },
        ]
    },
];

// export const inventoryData : any[] = [
   
//     {
//         "id": 1,
//         "rowIndex": 1,
//         "parentId": null,
//         "routeLink": "masters",
//         "icon": "fa-solid fa-tags",
//         "label": "Masters",
//         "checkList": null,
//         "isDeleted": true
//     },
//     {
//         "id": 2,
//         "rowIndex": 2,
//         "parentId": 1,
//         "routeLink": "location",
//         "icon": "fa-solid fa-location",
//         "label": "Material",
//         "checkList": null,
//         "isDeleted": true
//     },
//     {
//         "id": 3,
//         "rowIndex": 3,
//         "parentId": null,
//         "routeLink": "operation",
//         "icon": "fa-solid fa-toolbox",
//         "label": "Transaction",
//         "checkList": null,
//         "isDeleted": true
//     },
//     {
//         "id": 4,
//         "rowIndex": 4,
//         "parentId": 3,
//         "routeLink": "reports",
//         "icon": "fa-solid fa-file",
//         "label": "Sales Order",
//         "checkList": null,
//         "isDeleted": true
//     }
    
// ]

export const inventoryData = [
    {
        id: 1,
        parentId: null,
        routeLink: 'Master',
        icon: 'fa-solid fa-tags',
        label: 'Masters',
        // expanded: true,
        items: [
            // { id: 31,parentId: 3, label: 'Material Indent', routeLink: 'inventory-master/material-indent/form'  },
            { id: 32,parentId: 3, label: 'BOM Template', routeLink: 'inventory-masters/bom-template'  },
        ]
    },
    {
        id: 2,
        parentId: null,
        routeLink: 'transaction',
        icon: 'fa-solid fa-toolbox',
        label: 'Transactions',
        // expanded: false,
        items: [
            { id: 41,parentId: 4, label: 'Sales Order', routeLink: 'transaction/sales-order'  },
        ]
    },
    // {
    //     id: 3,
    //     parentId: null,
    //     routeLink: 'production',
    //     icon: 'fa-solid fa-tags',
    //     label: 'Productions',
    //     // expanded: false,
    //     items: [
    //         { id: 41,parentId: 4, label: 'Production Indent', routeLink: 'production/production-indent/form'  },
    //     ]
    // },
]