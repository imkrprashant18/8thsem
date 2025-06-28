
import React from 'react'




const SpecialityPage = async () => {
        const searchParams = new URLSearchParams(window.location.search);
        const specialty = searchParams.get('specialty') || 'General'; // Default to 'General' if not found
        console.log(specialty)


        return (
                <div>SpecialityPage: {specialty} </div>
        )
}

export default SpecialityPage