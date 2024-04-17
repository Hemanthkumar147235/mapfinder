import { Component,OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { ThemePalette } from '@angular/material/core'; 
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
 

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'] 
})


export class MapComponent implements OnInit{
  constructor( private http:HttpClient,private breakpointObserver: BreakpointObserver){ this.filteredItems = this.filteredData; }
  data:any;
  search_Data:any;
  selecteddata: any = {};
  isasia:any[]=[];
  pagedata: any;
  // currentPage: number = 1;
  currentPage: number = this.getpagenum();
  itemsPerPage: number   = this.getpagesize();

  pageSizeOptions: number[] = [4, 8, 12, 16];
  filteredData: any[] = [];
  //************* */
  filteredAsiaData: any[] = [];
  filteredAfricaData: any[] = [];
  filteredEuropeData: any[] = [];
  filteredAmericaData: any[] = [];
  filteredOceaniaData: any[] = [];

//  **********//
 issmallsize:boolean=false;

  changeview:string='frontpage';
  showparticulardata: String = 'all';
  filteredItems: any[] = [];
  search_text:string=''; 
   
 
  selectedCountry: string=this.getSelectCountry();
  
  theme: Theme = 'light-theme';


  ngOnInit(): void {
    
    try {
          this.http.get<any>('http://localhost:1111/').subscribe((response)=>{
          this.data = response;
          this.search_Data=this.data;
          this.filteredData = this.data;

          this.checkscreensize();
          
          const asiaFlags: boolean[] = [];
           
 
          this.filteredAsiaData = this.data.filter((item: any) => item.country.continents.includes('Asia'));
          //************************************************************************************** */
          const AfricaFlags: boolean[] = [];
          for (let i = 0; i < this.data.length; i++) {
            const country = this.data[i].country;
            const isAfrica = country.continents.includes('Africa');
            AfricaFlags.push(isAfrica);
          } 
          this.filteredAfricaData = this.data.filter((item: any, index: number) => AfricaFlags[index]);
           
          //************************************************************************************** */
          const EuropeFlags: boolean[] = [];
          for (let i = 0; i < this.data.length; i++) {
            const country = this.data[i].country;
            const isEurope = country.continents.includes('Europe');
            EuropeFlags.push(isEurope);
          } 
          this.filteredEuropeData = this.data.filter((item: any, index: number) => EuropeFlags[index]);
          //************************************************************************************** */
          const AmericaFlags: boolean[] = [];
          // 
          this.filteredAmericaData = this.data.filter((item: any) => item.country.continents.includes('South America'||'North America'));
          console.log(this.filteredAmericaData)
          //************************************************************************************** */
          const OceaniaFlags: boolean[] = [];
          for (let i = 0; i < this.data.length; i++) {
            const country = this.data[i].country;
            const isOceania = country.continents.includes('Oceania');
            OceaniaFlags.push(isOceania);
          } 
          this.filteredOceaniaData = this.data.filter((item: any, index: number) => OceaniaFlags[index]);
          //************************************************************************************** */
           })
        } 
        catch (error) {
          console.log("error"+error)
        }  
  }
 
  selectcard(selecteditem:any){
    this.selecteddata=selecteditem;
    
    this.changeview='detialpage';
    console.log(this.changeview)
  }
  
   goback(){
    this.changeview='frontpage';
    this.selecteddata=null
   }
 
  showParticular(): void {
    if (this.search_text.length >= 1) {
      let filteredItems;
      

      switch (this.selectedCountry) {
        case 'Please Choose':
          
          this.currentPage = 1; 
          filteredItems = this.search_Data.filter((item: any) => {
            return this.isCapitalMatch(item.country.name.common);
          });
          break;
        case 'Africa':
          filteredItems = this.filteredAfricaData.filter((item: any) => {
            return this.isCapitalMatch(item.country.name.common);
          });
          break;
        case 'America':
          filteredItems = this.filteredAmericaData.filter((item: any) => {
            return this.isCapitalMatch(item.country.name.common);
          });
          break;
        case 'Asia':
          filteredItems = this.filteredAsiaData.filter((item: any) => {
            return this.isCapitalMatch(item.country.name.common);
          });
          break;
        case 'Europe':
          filteredItems = this.filteredEuropeData.filter((item: any) => {
            return this.isCapitalMatch(item.country.name.common);
          });
          break;
        case 'Oceania':
          filteredItems = this.filteredOceaniaData.filter((item: any) => {
            return this.isCapitalMatch(item.country.name.common);
          });
          break;
        default:
          filteredItems = this.filteredData.filter((item: any) => {
            return this.isCapitalMatch(item.country.name.common);
          });
          break;
      }
      if (filteredItems.length > 0) {
        this.showparticulardata = 'capital';
        this.search_Data = filteredItems; 
        this.filteredItems = filteredItems;
      } else {
        this.showparticulardata = 'not_found'; 
      }
    } else {
      this.showparticulardata = 'all';
    }
  }
  
  
  
  isCapitalMatch(capital: string | string[]): boolean {
    if (Array.isArray(capital)) {
      return capital.some((c: string) => c.toLowerCase().startsWith(this.search_text.toLowerCase()));
    } else {
      return typeof capital === 'string' && capital.toLowerCase().startsWith(this.search_text.toLowerCase());
    }
  }
  
  onPageSizeChange(event: any): void {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1; 
    this.addpagesize(this.itemsPerPage)
    console.log("Items per page:", this.itemsPerPage);
  }

  onPageChange(event: number): void {
    this.currentPage = event;
    this.addpagenum(this.currentPage);
   
    console.log("Current page:", this.currentPage);
  }
   
onCountryChange(selectedCountry: string): void {
  this.selectedCountry = selectedCountry;
  this.showParticular();
  this.addSelectCountry(this.selectedCountry);
  if (selectedCountry === 'Please Choose') {
    this.currentPage = 1; 
    this.itemsPerPage = this.getpagesize(); 
  }
 
  this.currentPage = 1; 
}
toggletheme(): void {
  console.log('Current theme:', this.theme);
  this.theme = (this.theme === 'light-theme') ? 'dark-theme' : 'light-theme';
  // this.document.body.classList.replace(this.theme,newTheme);

  console.log('New theme:', this.theme);
}
 addpagenum(c:number):void{
 
  localStorage.setItem('currentPage',this.currentPage.toString())
 }
 getpagenum():number{
  
  const storedPage = localStorage.getItem('currentPage');
  return storedPage ? parseInt(storedPage, 10) : 1;
 }

 addpagesize(itemsPerPage: number): void {
  localStorage.setItem('itemsPerPage', itemsPerPage.toString());
}

getpagesize(): number    {
  const storedItemsPerPage = localStorage.getItem('itemsPerPage');
  return storedItemsPerPage ? parseInt(storedItemsPerPage, 10) : 4;
}
addSelectCountry(selectedCountry: string): void {
  localStorage.setItem('selectedCountry', selectedCountry);
}

getSelectCountry(): string {
  return localStorage.getItem('selectedCountry') || 'Please Choose';
}

checkscreensize(){

   this.breakpointObserver.observe([
    Breakpoints.XSmall,
    Breakpoints.Small
  ]).subscribe((result)=>{
    this.issmallsize=result.matches
  })

}

}


type Theme = 'light-theme' | 'dark-theme';









 































  

  // const asiaFlags: boolean[] = [];

  // for (let i = 0; i < this.data.length; i++) {
  //   const country = this.data[i].country;
  //   const isAsia = country.continents.includes('Asia');
  //   // Store the boolean value in the array
  //   asiaFlags.push(isAsia);
  // }
  
  // console.log("Asia flags:", asiaFlags);
   
  // this.filteredAsiaData = this.data.filter((item: any, index: number) => asiaFlags[index]);
  
  // console.log(this.filteredAsiaData)