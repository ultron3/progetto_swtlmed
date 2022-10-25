import { html, render } from "../lib/lit-html.js";
import { Router } from "../lib/vaadin-router.js";
import { router } from "../index.js";
import { findBox, updateBox } from "./boxStore.js";
import { createBox } from "../pharms/pharmStore.js";
import configData from "../config.js";

export default class BoxEdit extends HTMLElement {

    constructor() {
        super();
    }

    getRoot() {
        return this;
    }

    connectedCallback() {
        const { location } = router;
        this.id = location.params.box ;
        if (this.id == "undefined") {
            console.log("create..")
            this.data = {
                number:'',
                color:'',
                message:'',
                timebox:'',
                delta:''  
            }
            render(this.renderView(), this.getRoot());
        } else {
            findBox(this.id)
                .then(data => {
                    this.data = data;
                    render(this.renderView(), this.getRoot());
                })
        }

    }

    onInputChange(e) {
        const { name, value } = e.target;
        this.data[name] = value;
    }

    onSave(e) {
        e.preventDefault();
        const {form} = e.target;
        if(!form.checkValidity()){
            form.reportValidity();
            return;
        }
        if (this.id === "undefined") {
            createBox(configData.idpharm, this.data)
                .then(_ => {
                    Router.go(`/pharms/${configData.data}/boxes/`);
                })
        } else {
            updateBox(this.id, this.data)
                .then(_ => {
                    Router.go(`/pharms/${id}/boxes/`);
                })
        }

    }

    onCancel(e) {
        e.preventDefault();
        Router.go(`/pharms/${configData.idpharm}/boxes/`);
    }

    renderView() {
        return html`
           <form>
                <div class="field">
                    <label class="label">Number</label>
                    <div class="control">
                        <input required class="input" type="number" @change=${e => this.onInputChange(e)} name="number" min="1" .value=${this.data.number}>
                    </div>
                </div>
                
                <div class="field">
                    <label class="label">Color</label>
                    <div class="control">
                        <input required class="input" type="text" name="color" @change=${e => this.onInputChange(e)} .value=${this.data.color} placeholder="color...">
                    </div>
                </div>

                <div class="field">
                    <label class="label">Messagge</label>
                    <div class="control">
                        <textarea  required class="textarea" name="message" @change=${e => this.onInputChange(e)} .value=${this.data.message} placeholder="Contenuto box..."></textarea>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Orario</label>
                    <div class="control">
                        <input required class="input" type="time" name="timebox" @change=${e => this.onInputChange(e)} .value=${this.data.timebox} >
                    </div>
                </div>

                <div class="field">
                    <label class="label">Margine d'assunzione</label>
                    <div class="control">
                        <input required class="input" type="number" name="delta" @change=${e => this.onInputChange(e)} .value=${this.data.delta}>
                    </div>
                </div>

                <div class="field is-grouped">
                    <div class="control">
                        <button class="button is-link" @click = ${e => this.onSave(e)}>Save</button>
                    </div>
                    <div class="control">
                        <button class="button is-link is-light" @click = ${e => this.onCancel(e)}>Cancel</button>
                    </div>
                </div>
           </form>
        `;
    }
}
customElements.define("box-edit", BoxEdit);