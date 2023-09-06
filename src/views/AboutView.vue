<template>
    <div class="about">
        <h1>About</h1>
        <h2>The JavaScript assignment</h2>
        <p>This application let's you mark three points and create a parallelogram from them. 
            It also calculates the area of the parallelogram and generates a yellow circle with tha same size, 
            located in the center of the parallelogram.</p>
        <h2>How to use</h2>
        <ol>
            <li>Got to startpage</li>
            <li>Mark three points</li>
            <li>Look at the created parallelogram</li>
            <li>Mark another point to generate a new parallelogram</li>
            <li>Or, click on reset to start over</li>
        </ol>
        <h2>Created by</h2>
        <p>Joakim Lundell, full-stack developer with a special eye on the front-end. Has over 20 years experience as a programmer but struggled a bit more with this task than he wants to admit :)</p>
        <h2>Credits</h2>
        <p>Thanks to VetFamily for coming up with this great fun assignment.</p>
        <p>Regards, <i>Joakim Lundell</i></p>
    </div>
</template>

<style>
.about {
    padding: calc(var(--header-height) + var(--padding)) var(--padding)
}
</style>
