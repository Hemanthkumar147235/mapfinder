import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-dummy',
  templateUrl: './dummy.component.html',
  styleUrls: ['./dummy.component.css']
})
 

 
 


export class DummyComponent implements OnInit{
  constructor(private http:HttpClient){ this.filteredItems = this.filteredData; }
  data:any;
  search_Data:any;
  selecteddata: any = {}; // Initialize with an empty object
  isasia:any[]=[];
  pagedata: any;
  currentPage: number = 1;
  itemsPerPage: number = 4;
  pageSizeOptions: number[] = [4, 8, 12, 16];
  filteredData: any[] = [];
  filteredAsiaData: any[] = [];

 
  changeview:string='frontpage';
  showparticulardata: String = 'all';
  filteredItems: any[] = [];
  search_text:string=''; 
   
 
  selectedCountry: String='Please Choose';


   
  
  ngOnInit(): void {
    
    try {
          this.http.get<any>('http://localhost:1111/').subscribe((response)=>{
          this.data = response;
          this.search_Data=this.data;
          this.filteredData = this.data;
          
          console.log(this.data)
          console.log( this.filteredData)
          
           const asiaFlags: boolean[] = [];
          for (let i = 0; i < this.data.length; i++) {
            const country = this.data[i].country;
            const isAsia = country.continents.includes('Asia');
            asiaFlags.push(isAsia);
          } 
          this.filteredAsiaData = this.data.filter((item: any, index: number) => asiaFlags[index]);
 
          
           })
        } 
        catch (error) {
          console.log("error"+error)
        }  
  }
 
  selectcard(selecteditem:any){
    this.selecteddata=selecteditem
     console.log(this.selecteddata)
    this.changeview='detialpage';
  }
  
  
   goback(){
    this.changeview='frontpage';
    this.selecteddata=null
   }
 
  showParticular(): void {
    if (this.search_text.length >= 1) {
      const filteredItems = this.filteredData.filter((item: any) => {
        return this.isCapitalMatch(item.country.name.common);
      });
      if (filteredItems.length > 0) {
        this.showparticulardata = 'capital';
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
  }

  onPageChange(event: number): void {
    this.currentPage = event;
  }
  
  

  
  }











































  

