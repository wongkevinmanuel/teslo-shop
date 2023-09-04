import React, {FC} from 'react'
import { ISize } from '../../interfaces';
import { Box, Button } from '@mui/material';

interface Props{
    childrend?: React.ReactNode,
    selectedSize?: ISize,
    sizes: ISize[];
}

export const SizeSelector: FC<Props> = ({selectedSize, sizes}) => {
  return (
    <Box>
        {
            sizes.map(size=> (
                <Button key={size} size='small'
                color={selectedSize === size ? 'primary' : 'info'}
                > {size} </Button>
            ))
        }
    </Box>
  )
}
