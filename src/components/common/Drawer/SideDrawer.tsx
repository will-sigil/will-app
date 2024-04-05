import { Box, AppBar, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { Battery0Bar, Cake, Star } from "@mui/icons-material"

const menuItems = [
    {
        text: 'Battery',
        Icon: <Battery0Bar />
    },
    {
        text: 'Cake!',
        Icon: <Cake />
    },
    {
        text: 'Star',
        Icon: <Star />
    },
]
type DrawerProps = {

}
const DList  = (
    <Box>
        <List>
            {
                menuItems.map((item) => 
                     (
                        <ListItem key={item.text}>
                            <ListItemButton>
                                <ListItemIcon>
                                    {item.Icon}
                                </ListItemIcon>
                                <ListItemText>
                                    {item.text}
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    )
                )
            }
        </List>
    </Box>
)

const drawerWidth = 240;

export const SideDrawer : React.FC<DrawerProps> = () => {
    
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
            >
                <Drawer sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    {DList}
                </Drawer>
            </AppBar>
        </Box>
    )
}